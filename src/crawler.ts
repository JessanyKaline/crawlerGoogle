import puppeteer from 'puppeteer';


interface SearchResult {
  title: string;
  url: string;
}

async function searchGoogle(query: string): Promise<void> {
  try {
    const browser = await puppeteer.launch(); 
    const page = await browser.newPage(); 

    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    await page.waitForSelector('div.g');

    const searchResults: SearchResult[] = await page.evaluate(() => {
      const results = document.querySelectorAll('div.g');
      const data: SearchResult[] = [];

      results.forEach((result) => {
        const titleElement = result.querySelector('h3');
        const linkElement = result.querySelector('a');

        if (titleElement && linkElement) {
          const title = titleElement.textContent?.trim();
          const url = linkElement.getAttribute('href')?.replace('/url?q=', '').split('&')[0];

          if (title && url) {
            data.push({ title, url });
          }
        }
      });

      return data;
    });

    console.log('Resultados da pesquisa:');
    searchResults.forEach((result) => {
      console.log(`- ${result.title}: ${result.url}`);
    });

    await browser.close();
    
  } catch (error) {
    console.error('Ocorreu um erro durante a execução do crawler:', error);
    
  }
}

const query = 'verão no Canadá';
searchGoogle(query);
