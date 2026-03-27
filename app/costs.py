COST_PER_1K_TOKENS = {
    "gpt-4o": {"prompt": 0.005, "completion": 0.015},
    "gpt-4o-mini": {"prompt": 0.00015, "completion": 0.0006},
    "gpt-3.5-turbo": {"prompt": 0.0005, "completion": 0.0015},
}

DEFAULT_COST = {"prompt": 0.005, "completion": 0.015}


def estimate_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    rates = COST_PER_1K_TOKENS.get(model, DEFAULT_COST)
    prompt_cost = (prompt_tokens / 1000) * rates["prompt"]
    completion_cost = (completion_tokens / 1000) * rates["completion"]
    return round(prompt_cost + completion_cost, 6)
