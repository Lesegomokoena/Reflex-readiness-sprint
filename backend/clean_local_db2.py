import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'instance', 'app.db')

if not os.path.exists(db_path):
    print("app.db not found at", db_path)
    exit(0)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Find andrew and ken
cursor.execute("SELECT id, name FROM reflex_users WHERE role='rider' AND (name LIKE '%andrew%' OR name LIKE '%ken%')")
riders = cursor.fetchall()

small_andrew_id = None
to_delete = []

for r_id, r_name in riders:
    if r_name.startswith('a') and r_name.lower() == 'andrew':
        small_andrew_id = r_id
    else:
        to_delete.append(r_id)

if not small_andrew_id:
    print("Small andrew not found in local db, creating one...")
    import uuid
    from datetime import datetime
    small_andrew_id = str(uuid.uuid4())
    # Create small andrew
    cursor.execute("""
        INSERT INTO reflex_users (id, name, email, password_hash, role, created_at)
        VALUES (?, 'andrew', 'andrew_local@demo.com', 'dummy_hash', 'rider', ?)
    """, (small_andrew_id, datetime.utcnow()))

if to_delete:
    for uid in to_delete:
        cursor.execute("UPDATE reflex_delivery_requests SET assigned_rider_id = ? WHERE assigned_rider_id = ?", (small_andrew_id, uid))
        cursor.execute("UPDATE reflex_delivery_requests SET created_by_id = ? WHERE created_by_id = ?", (small_andrew_id, uid))
        cursor.execute("UPDATE reflex_delivery_events SET actor_id = ? WHERE actor_id = ?", (small_andrew_id, uid))
        cursor.execute("UPDATE reflex_proof_of_deliveries SET scanned_by_id = ? WHERE scanned_by_id = ?", (small_andrew_id, uid))
        cursor.execute("DELETE FROM reflex_users WHERE id = ?", (uid,))
    
    conn.commit()
    print(f"Successfully cleaned up {len(to_delete)} duplicates from local app.db")
else:
    print("No duplicates found in local app.db")

conn.close()
