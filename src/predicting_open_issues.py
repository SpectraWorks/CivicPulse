import pandas as pd
from datetime import datetime

def predict_open_issues(csv_path, model):
    df = pd.read_csv(csv_path)

    df["status"] = df["status"].astype(str).str.strip().str.lower()
    df["reported_date"] = pd.to_datetime(df["reported_date"], errors="coerce")

    df = df.dropna(subset=["reported_date"])

    today = df["reported_date"].max()
    df["days_since_reported"] = (today - df["reported_date"]).dt.days

    open_issues = df[(df["status"] != "resolved") & (df["days_since_reported"] < 60)].copy()

    if len(open_issues) == 0:
        print("No open issues found under 60 days.")
        return open_issues

    X = open_issues[["city", "ward", "issue_type"]]
    X = pd.get_dummies(X)

    for col in model.feature_names_in_:
        if col not in X.columns:
            X[col] = 0

    X = X[model.feature_names_in_]

    open_issues["predicted_total_days"] = model.predict(X)

    open_issues["predicted_remaining_days"] = (open_issues["predicted_total_days"] - open_issues["days_since_reported"])

    return open_issues[["city", "ward", "issue_type", "days_since_reported", "predicted_remaining_days"]]
