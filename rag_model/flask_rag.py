from flask import Flask, request, jsonify
from rag_core import generate_with_agent
import torch

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "Missing 'query' field in request body"}), 400

    try:
        summary, source_info = generate_with_agent(user_query)
        stringified_steps = [str(step) for step in source_info]
        
        torch.cuda.empty_cache()
        return jsonify({
            "answer": summary,
            "source": stringified_steps
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)