import numpy as np
from sklearn.linear_model import LinearRegression


def projection_funct(values,pred_len):
    """Create a list of the next 26 projected values
    ...

    Parameters
    ----------
    values: List[float]
        List of values of the input from 2015 to 2024
    pred_len: int
        Number of values to predict

    Returns
    -------
    List[float]
        A list of the next pred_len projected values
    """
    x = np.array([i for i in range(len(values))]).reshape(-1,1)
    y = np.array(values).reshape(-1,1)
    xp= np.array([i for i in range(len(values),len(values)+pred_len)]).reshape(-1,1)
    regsr=LinearRegression()
    regsr.fit(x,y)
    yp= regsr.predict(xp)
    return np.round(yp.flatten().tolist(),2)



