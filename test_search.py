
import os

from langchain_ollama import ChatOllama

from langchain_tavily import TavilySearch

os.environ["TAVILY_API_KEY"] = "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"

llm = ChatOllama(model="qwen2.5-coder:7b")

search_tool = TavilySearch(max_results=3)

# Step 1: Search

query = "What is the latest news on AI today?"

search_results = search_tool.invoke(query)

# Step 2: Feed results into the model

context = str(search_results)

response = llm.invoke(f"Based on these search results, answer the question: {query}\n\nResults: {context}")

print(response.content)
