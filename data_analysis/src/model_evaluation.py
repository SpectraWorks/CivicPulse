from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

def evaluate_model(y_true, y_pred):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)

    print("---- MODEL EVALUATION ----")
    print("RMSE:", rmse)
    print("R2 score:", r2)
