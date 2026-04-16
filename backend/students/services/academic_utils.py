def calculate_cgpa(student):
    records = student.records.filter(verified=True)
    if not records.exists():
        return 0.0

    total = sum(r.cgpa for r in records)
    return round(total / records.count(), 2)
