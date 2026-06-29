from vector_store import get_qdrant_client
from qdrant_client.http import models as rest
from config import QDRANT_COLLECTION

client = get_qdrant_client()

# Get all points from original collection
print(f"Reading from {QDRANT_COLLECTION}...")
scroll = client.scroll(
    collection_name=QDRANT_COLLECTION,
    limit=10000,
    with_payload=True,
    with_vectors=True
)

points = scroll[0]
total = len(points)
print(f"Found {total} points")

if total == 0:
    print("ERROR: No points found in original collection!")
    exit()

# Convert Record objects to dictionaries for upsert
converted_points = []
for point in points:
    converted_points.append({
        "id": point.id,
        "vector": point.vector,
        "payload": point.payload
    })

# Split into 3 shards
shard_size = len(converted_points) // 3
shards = {
    "solar": converted_points[:shard_size],
    "wind": converted_points[shard_size:2*shard_size],
    "nuclear": converted_points[2*shard_size:]
}

# Create collections and upload
for zone_name, zone_points in shards.items():
    collection_name = f"research_papers_{zone_name}"
    
    print(f"\nProcessing {zone_name}...")
    print(f"  Points to upload: {len(zone_points)}")
    
    # Delete if exists
    try:
        client.delete_collection(collection_name)
        print(f"  Deleted existing {collection_name}")
    except:
        print(f"  No existing collection to delete")
    
    # Create new collection
    client.create_collection(
        collection_name=collection_name,
        vectors_config=rest.VectorParams(
            size=384,
            distance=rest.Distance.COSINE
        )
    )
    print(f"  Created {collection_name}")
    
    # Upload points in batches
    batch_size = 100
    for i in range(0, len(zone_points), batch_size):
        batch = zone_points[i:i+batch_size]
        client.upsert(
            collection_name=collection_name,
            points=batch
        )
    print(f"  ✅ Uploaded {len(zone_points)} points")

print("\n✅ All shards created successfully!")
