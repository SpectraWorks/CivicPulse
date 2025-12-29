from src.load_data import loading_files
from src.clean_data import clean_and_merge
from src.linear_regression_model import model_training
from src.model_evaluation import evaluate_model
from src.predicting_open_issues import predict_open_issues
from src.visualize import visualize_predictions
from src.combined_vis import visualize_combined

def main():
    raw_dataframes = loading_files()
    cleaned_dataframe = clean_and_merge(raw_dataframes)
    cleaned_dataframe.to_csv("data/cleaned.csv", index=False)

    model, X_test, y_test = model_training("data/cleaned.csv")
    predictions = model.predict(X_test)
    evaluate_model(y_test, predictions)

    predictions_open = predict_open_issues("data/cleaned.csv",model)
    predictions_open.to_csv("data/open_issue_predictions.csv", index=False)

    visualize_predictions("data/open_issue_predictions.csv")
    visualize_combined("data/open_issue_predictions.csv")


if __name__ == "__main__":
    main()

