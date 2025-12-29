import os
import pandas as pd
import matplotlib.pyplot as plt

def visualize_combined(csv_path):
    df = pd.read_csv(csv_path)

    os.makedirs("visuals", exist_ok=True)
    df["overdue"] = df["predicted_remaining_days"] < 0

    overdue_count = len(df[df["overdue"] == True])
    not_overdue_count = len(df[df["overdue"] == False])

    plt.figure()
    plt.bar(["Not Overdue", "Overdue"],[not_overdue_count, overdue_count])
    plt.title("All Cities - Overdue vs Not Overdue Issues")
    plt.ylabel("Number of Issues")

    plt.savefig("visuals/all_cities_counts.png")
    plt.close()

    plt.figure()
    plt.hist(df["predicted_remaining_days"], bins=30)
    plt.axvline(0)
    plt.title("All Cities - Remaining Days Distribution")
    plt.xlabel("Predicted Remaining Days")
    plt.ylabel("Number of Issues")

    plt.savefig("visuals/all_cities_distribution.png")
    plt.close()