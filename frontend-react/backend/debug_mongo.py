
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

uri = "mongodb+srv://krishnashinde:krishna%409898@cluster1.cf39wey.mongodb.net/aetherx?appName=Cluster1"

async def test_connect():
    print(f"Testing connection to: {uri}")
    try:
        client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
        print("Client created. Attempting to get server info...")
        info = await client.server_info()
        print("Connected!")
        print(info)
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connect())
