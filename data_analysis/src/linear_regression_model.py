import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

def model_training(csv_path):
    df = pd.read_csv(csv_path)

    x = df[["city", "ward", "issue_type"]]
    y = df["resolution_time_days"]

    x = pd.get_dummies(x, drop_first=True)

    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    lm = LinearRegression()
    lm.fit(X_train, y_train)

    return lm, X_test, y_test
