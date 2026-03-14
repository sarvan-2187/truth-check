from newspaper import Article

def scrape_article(url: str) -> str:
    article = Article(url)
    article.download()
    article.parse()
    return f"{article.title}\n\n{article.text}".strip()
