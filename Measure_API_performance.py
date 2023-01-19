import time
import uuid

import requests

BASE_URL = "https://api.mobilesys.de"


def assert_status_code(response, code):
    if not response.status_code == code:
        raise RuntimeError("Error: " + response.text)


def time_and_average(callable):
    samples = 3

    start = time.time()
    for i in range(samples):
        callable()
    return (time.time() - start) / samples


def main():
    create_user_response = requests.post(url=f"{BASE_URL}/users", json={
        "email": f"perftest-{uuid.uuid4()}@test.com",
        "password": "securepassword",
        "password2": "securepassword"
    })
    assert_status_code(create_user_response, 201)

    token = create_user_response.json()['access_token']
    print(token)

    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})

    stocks_response = session.get(f"{BASE_URL}/stocks?name=")
    assert_status_code(stocks_response, 200)

    stocks = stocks_response.json()

    for i, stock in enumerate(stocks):
        add_stock_response = session.post(f"{BASE_URL}/users/me/stocks/{stock['id']}", json={"amount": 50})
        try:
            assert_status_code(add_stock_response, 201)
        except RuntimeError:
            print(f"Could not add stock with id {stock['id']}: {add_stock_response.text}")

        elapsed_time = time_and_average(
            lambda: session.get(f"{BASE_URL}/users/me/stocks"))
        print(f"Time to get portfolio with {i + 1} stocks: {elapsed_time:.2f}s")

if __name__ == '__main__':
    main()
