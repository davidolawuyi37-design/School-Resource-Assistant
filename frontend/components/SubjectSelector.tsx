"use client";

const subjects = ["Mathematics", "English", "Basic Science", "Physics", "Chemistry", "Biology", "Economics", "Computer Science"];

export function SubjectSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 rounded-xl border bg-background/70 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
    >
      {subjects.map((subject) => (
        <option key={subject}>{subject}</option>
      ))}
    </select>
  );
}
