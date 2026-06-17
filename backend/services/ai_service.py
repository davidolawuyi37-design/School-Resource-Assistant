from __future__ import annotations

import json
import os
import re

from dotenv import load_dotenv

load_dotenv()


class AIService:
    def __init__(self) -> None:
        self.provider = os.getenv("LLM_PROVIDER", "deepseek").lower()
        self.model_name = os.getenv("MODEL_NAME", "deepseek-chat")
        self.api_key = os.getenv("LLM_API_KEY") or os.getenv("API_KEY")
        self.base_url = os.getenv("LLM_BASE_URL") or self._default_base_url()

    def _default_base_url(self) -> str | None:
        if self.provider == "deepseek":
            return "https://api.deepseek.com"
        return os.getenv("OPENAI_BASE_URL")

    def _chat(self, prompt: str) -> str:
        if not self.api_key:
            return self._fallback_answer(prompt)

        try:
            from langchain_core.output_parsers import StrOutputParser
            from langchain_core.prompts import ChatPromptTemplate
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(
                model=self.model_name,
                api_key=self.api_key,
                base_url=self.base_url,
                temperature=float(os.getenv("LLM_TEMPERATURE", "0.2")),
            )
            chain = ChatPromptTemplate.from_template("{prompt}") | llm | StrOutputParser()
            return chain.invoke({"prompt": prompt})
        except Exception as error:
            return (
                "I could not reach the configured AI provider, so here is a local study guide instead.\n\n"
                f"{self._fallback_answer(prompt)}\n\nTechnical detail: {error}"
            )

    @staticmethod
    def _fallback_answer(prompt: str) -> str:
        topic_match = re.search(r"Topic:\s*(.+)", prompt)
        subject_match = re.search(r"Subject:\s*(.+)", prompt)
        topic = topic_match.group(1).strip() if topic_match else "this topic"
        subject = subject_match.group(1).strip() if subject_match else "the subject"
        return (
            f"Let's learn **{topic}** in {subject}.\n\n"
            f"Start with the big idea: {topic} is easier when you break it into small parts. "
            "First, learn the key words. Next, study one example. Then try a short practice question.\n\n"
            "**Simple example:** imagine explaining the idea to a friend in three sentences. "
            "If you can do that, you are already building understanding.\n\n"
            "**Quick check:** write one thing you know, one thing that is confusing, and one question you want answered."
        )

    @staticmethod
    def _extract_json(text: str) -> dict:
        match = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
        raw = match.group(1) if match else text
        raw = raw.strip()
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            raw = raw[start:end + 1]
        return json.loads(raw)

    def answer_tutor(self, education_level: str, subject: str, topic: str, message: str, mode: str | None = None) -> str:
        prompt = f"""
You are DD World School Resource Assistant, a patient AI tutor.

Education level: {education_level}
Subject: {subject}
Topic: {topic}
Mode: {mode or "teach"}
Student message: {message}

Give a clear, encouraging answer. Use headings and examples when helpful.
If the student asks for simpler wording, use shorter sentences and familiar examples.
"""
        return self._chat(prompt)

    def generate_quiz(self, education_level: str, subject: str, topic: str, count: int) -> list[dict]:
        prompt = f"""
Create a multiple-choice quiz.

Education level: {education_level}
Subject: {subject}
Topic: {topic}
Count: {count}

Return only valid JSON:
{{
  "questions": [
    {{
      "id": "q1",
      "type": "multiple_choice",
      "question": "Question text",
      "options": [
        {{ "id": "A", "label": "Option A" }},
        {{ "id": "B", "label": "Option B" }},
        {{ "id": "C", "label": "Option C" }},
        {{ "id": "D", "label": "Option D" }}
      ],
      "answer": "A",
      "explanation": "Why the answer is correct.",
      "skill": "Specific skill tested"
    }}
  ]
}}
"""
        if not self.api_key:
            return self._fallback_quiz(topic, count)

        text = self._chat(prompt)
        try:
            data = self._extract_json(text)
            questions = data.get("questions", [])
            if not questions:
                raise ValueError("No questions returned")
            return questions
        except Exception:
            return self._fallback_quiz(topic, count)

    @staticmethod
    def _fallback_quiz(topic: str, count: int) -> list[dict]:
        questions = []
        for index in range(1, count + 1):
            questions.append({
                "id": f"q{index}",
                "type": "multiple_choice",
                "question": f"Which statement best helps you understand {topic}? ({index})",
                "options": [
                    {"id": "A", "label": "Break the topic into smaller ideas."},
                    {"id": "B", "label": "Memorize words without examples."},
                    {"id": "C", "label": "Skip practice questions."},
                    {"id": "D", "label": "Avoid asking follow-up questions."},
                ],
                "answer": "A",
                "explanation": "Breaking a topic into smaller ideas makes it easier to understand and remember.",
                "skill": "Study strategy",
            })
        return questions


ai_service = AIService()
