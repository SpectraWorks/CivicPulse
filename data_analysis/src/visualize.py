import os
import pandas as pd
import matplotlib.pyplot as plt

def visualize_predictions(csv_path):
    df = pd.read_csv(csv_path)

    os.makedirs("visuals", exist_ok=True)

    df["overdue"] = df["predicted_remaining_days"] < 0
    cities = df["city"].unique()

    for city in cities:
        city_df = df[df["city"] == city]

        overdue_count = len(city_df[city_df["overdue"] == True])
        not_overdue_count = len(city_df[city_df["overdue"] == False])

        plt.bar(["Not Overdue", "Overdue"],[not_overdue_count, overdue_count])
        plt.title(f"{city} - Issue Status")
        plt.ylabel("Number of Issues")

        plt.savefig(f"visuals/{city}_counts.png")
        plt.close()

        plt.figure()
        plt.hist(city_df["predicted_remaining_days"], bins=20)
        plt.axvline(0)
        plt.title(f"{city} - Remaining Days Distribution")
        plt.xlabel("Predicted Remaining Days")
        plt.ylabel("Number of Issues")

        plt.savefig(f"visuals/{city}_distribution.png")
        plt.close()
