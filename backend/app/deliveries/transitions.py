VALID_TRANSITIONS = {
    'PENDING': ['ASSIGNED', 'CANCELLED'],
    'ASSIGNED': ['PICKED_UP', 'CANCELLED'],
    'PICKED_UP': ['DELIVERED', 'CANCELLED'],
    'DELIVERED': [],
    'CANCELLED': []
}

def is_valid_transition(current_status, next_status):
    allowed = VALID_TRANSITIONS.get(current_status, [])
    return next_status in allowed
