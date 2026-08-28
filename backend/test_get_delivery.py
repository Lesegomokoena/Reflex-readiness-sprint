import requests
base_url = "http://localhost:5000/api"

requests.post(f"{base_url}/auth/register", json={"name": "Disp", "email": "d@d.com", "password": "pass", "role": "dispatcher"})
res = requests.post(f"{base_url}/auth/login", json={"email": "d@d.com", "password": "pass"})
token = res.json()["data"]["access_token"]

dels = requests.get(f"{base_url}/deliveries", headers={"Authorization": f"Bearer {token}"})
print(dels.status_code)
d_data = dels.json()["data"]
if len(d_data) > 0:
    d_id = d_data[0]["id"]
    get_res = requests.get(f"{base_url}/deliveries/{d_id}", headers={"Authorization": f"Bearer {token}"})
    print("Dispatcher Get Delivery Status:", get_res.status_code)
    print("Dispatcher Get Delivery JSON:", get_res.json())
