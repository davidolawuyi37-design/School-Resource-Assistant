from dotenv import load_dotenv
import os
import json
import re

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()

# Output parser
parser = StrOutputParser()

llm = None


def get_llm():
    """Create the chat model lazily so API imports do not fail without a key."""
    global llm
    if llm is not None:
        return llm

    api_key = (
        os.getenv("API_KEY")
        or os.getenv("DEEPSEEK_API_KEY")
        or os.getenv("OPENAI_API_KEY")
    )

    if not api_key:
        raise RuntimeError(
            "Missing API key. Set API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY in your .env file."
        )

    llm = ChatOpenAI(
        model=os.getenv("AI_MODEL", "deepseek-v4-pro"),
        api_key=api_key,
        base_url=os.getenv("AI_BASE_URL", "https://api.deepseek.com"),
        temperature=float(os.getenv("AI_TEMPERATURE", "0")),
    )
    return llm


def _invoke_prompt(template, values):
    chain = ChatPromptTemplate.from_template(template) | get_llm() | parser
    return chain.invoke(values)


def _extract_json(text):
    match = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    raw = match.group(1) if match else text
    raw = raw.strip()
    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1:
        raw = raw[start:end + 1]
    return json.loads(raw)


def generate_lesson(topic, subject="General", education_status="Primary"):
    return _invoke_prompt(
        """
        You are an expert teacher.

        Teach the topic "{topic}" in the subject "{subject}"
        for a {education_status} learner.

        Explain clearly and simply.
        Use examples where necessary.
        End with 3 short key takeaways.
        """,
        {
            "education_status": education_status,
            "subject": subject,
            "topic": topic,
        },
    )


def simplify_lesson(topic, lesson, education_status="Primary"):
    return _invoke_prompt(
        """
        You are a patient teacher helping a {education_status} learner.

        Explain this topic again in simpler words:
        Topic: {topic}

        Previous lesson:
        {lesson}

        Use short sentences, friendly examples, and avoid jargon.
        """,
        {
            "education_status": education_status,
            "topic": topic,
            "lesson": lesson,
        },
    )


def answer_follow_up(question, context, education_status="Primary"):
    return _invoke_prompt(
        """
        You are a helpful tutor for a {education_status} learner.

        Use the lesson context to answer the student's question.

        Lesson context:
        {context}

        Student question:
        {question}

        Give a direct answer, then a simple example if useful.
        """,
        {
            "education_status": education_status,
            "context": context,
            "question": question,
        },
    )


def generate_quiz_data(topic, lesson, education_status="Primary", question_count=5):
    quiz_text = _invoke_prompt(
        """
        Create a multiple-choice quiz for a {education_status} learner.

        Topic: {topic}
        Lesson:
        {lesson}

        Return only valid JSON in this exact shape:
        {{
          "questions": [
            {{
              "id": "q1",
              "question": "Question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "explanation": "Why the answer is correct"
            }}
          ]
        }}

        Create exactly {question_count} questions.
        Make every correctAnswer match one option exactly.
        """,
        {
            "education_status": education_status,
            "topic": topic,
            "lesson": lesson,
            "question_count": question_count,
        },
    )
    data = _extract_json(quiz_text)
    questions = data.get("questions", [])
    if not isinstance(questions, list) or not questions:
        raise ValueError("The AI did not return quiz questions.")
    return questions


def grade_quiz(questions, user_answers):
    results = []
    correct_count = 0

    for question in questions:
        question_id = question["id"]
        user_answer = user_answers.get(question_id, "")
        correct_answer = question["correctAnswer"]
        is_correct = user_answer == correct_answer
        if is_correct:
            correct_count += 1

        results.append({
            "id": question_id,
            "question": question["question"],
            "options": question["options"],
            "userAnswer": user_answer,
            "correctAnswer": correct_answer,
            "isCorrect": is_correct,
            "explanation": question.get("explanation", ""),
        })

    total = len(questions)
    score_percent = round((correct_count / total) * 100) if total else 0
    return {
        "score": correct_count,
        "total": total,
        "scorePercent": score_percent,
        "results": results,
    }


# =========================================================
# Welcome Node
# =========================================================
def welcome_node():

    print("=" * 70)
    print("WELCOME TO DD WORLD SCHOOL RESOURCE ASSISTANT")
    print("=" * 70)
    print("This assistant supports learners worldwide.\n")

    levels = {
        "1": "Early Childhood",
        "2": "Primary",
        "3": "Secondary",
        "4": "Tertiary",
        "5": "Quit"
    }

    print("Select your education level:")
    print("1. Early Childhood")
    print("2. Primary")
    print("3. Secondary")
    print("4. Tertiary")
    print("5. Quit")

    choice = input("\nEnter choice (1-5): ").strip()

    if choice == "5":
        final_node()
        exit()

    education_status = levels.get(choice, "Primary")

    subject = input("\nEnter subject: ").strip()
    topic = input("Enter topic: ").strip()

    return education_status, subject, topic


# =========================================================
# Explanation Node
# =========================================================
def explanation_node(education_status, subject, topic):

    prompt = ChatPromptTemplate.from_template(
        """
        You are an expert teacher.

        Teach the topic "{topic}" in the subject "{subject}"
        for a {education_status} learner.

        Explain clearly and simply.
        Use examples where necessary.
        """
    )

    chain = prompt | get_llm() | parser

    explanation = chain.invoke({
        "education_status": education_status,
        "subject": subject,
        "topic": topic
    })

    print("\n" + "=" * 70)
    print("EXPLANATION")
    print("=" * 70)
    print(explanation)

    return explanation


# =========================================================
# Understanding Node
# =========================================================
def understanding_node():

    print("\n" + "=" * 70)
    print("UNDERSTANDING CHECK")
    print("=" * 70)

    understood = input(
        "Do you understand the explanation? (yes/no): "
    ).strip().lower()

    if understood == "no":
        feedback = input("\nWhat part was difficult?: ")

        print("\nThank you for your feedback.")
        return "re-explain", feedback
    
    choice = input(
        "\nWould you like a quiz or quit? (quiz/quit): "
    ).strip().lower()

    return choice, None

    

# =========================================================
# Quiz Node
# =========================================================
def quiz_node(education_status, subject, topic):

    prompt = ChatPromptTemplate.from_template(
        """
        Create 10 multiple-choice quiz questions on:

        Subject: {subject}
        Topic: {topic}

        Suitable for a {education_status} learner.

        Do NOT provide answers.
        """
    )

    chain = prompt | get_llm() | parser

    quiz = chain.invoke({
        "education_status": education_status,
        "subject": subject,
        "topic": topic
    })

    print("\n" + "=" * 70)
    print("QUIZ")
    print("=" * 70)
    print(quiz)

    return quiz


# =========================================================
# Answer Node
# =========================================================
def answer_node(quiz):

    show_answers = input(
        "\nShow answers? (yes/no): "
    ).strip().lower()

    if show_answers == "yes":

        prompt = ChatPromptTemplate.from_template(
            """
            Provide correct answers with explanations
            for the following quiz:

            {quiz}
            """
        )

        chain = prompt | get_llm() | parser

        answers = chain.invoke({
            "quiz": quiz
        })

        print("\n" + "=" * 70)
        print("ANSWERS")
        print("=" * 70)
        print(answers)


# =========================================================
# Final Node
# =========================================================
def final_node():

    print("\n" + "=" * 70)
    print("THANK YOU FOR USING DD WORLD SCHOOL RESOURCE ASSISTANT")
    print("=" * 70)
    print("Keep learning and keep growing.")
    print("With God, all things are possible.")
    print("Goodbye!")


# =========================================================
# Main Function
# =========================================================
def main():

    while True:

        try:

            education_status, subject, topic = welcome_node()

            while True:

                explanation_node(
                    education_status,
                    subject,
                    topic
                )

                choice, feedback = understanding_node()

                if choice == "re-explain":
                    print("\nRe-explaining...\n")
                    continue

                elif choice == "quiz":

                    quiz = quiz_node(
                        education_status,
                        subject,
                        topic
                    )

                    answer_node(quiz)

                elif choice == "quit":
                    break

                again = input(
                    "\nReturn to main menu? (yes/no): "
                ).strip().lower()

                if again != "yes":
                    final_node()
                    return

                break

        except Exception as error:

            print("\nAn error occurred:")
            print(error)


# =========================================================
# Run Program
# =========================================================
if __name__ == "__main__":
    main()



# welcome_node()    
#        |
# explanation_node()
#        |
# understanding_node()
#        |
#        |-- quiz___node()
#        |
#        |   answer_node()
#        |
#        |__ final_node()
        
