/**
 * Client-Side Article Search Controller
 * Real-time filter across published articles in the CTC Knowledge Base
 */

export interface SearchArticleItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
}

export function initArticleSearch(): void {
  const inputEl = document.querySelector<HTMLInputElement>('#article-search-input');
  const clearBtn = document.querySelector<HTMLButtonElement>('#article-search-clear');
  const countEl = document.querySelector<HTMLElement>('#article-search-count');
  const emptyStateEl = document.querySelector<HTMLElement>('#article-search-empty');
  const articleCards = document.querySelectorAll<HTMLElement>('[data-article-card]');

  if (!inputEl) return;

  function performFilter(query: string) {
    const q = query.trim().toLowerCase();
    let visibleCount = 0;

    articleCards.forEach((card) => {
      const title = card.getAttribute('data-title')?.toLowerCase() || '';
      const desc = card.getAttribute('data-desc')?.toLowerCase() || '';
      const tags = card.getAttribute('data-tags')?.toLowerCase() || '';

      const isMatch = !q || title.includes(q) || desc.includes(q) || tags.includes(q);

      if (isMatch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) {
      countEl.textContent = `找到 ${visibleCount} 篇相关指南`;
      countEl.style.display = q ? 'inline-block' : 'none';
    }

    if (emptyStateEl) {
      emptyStateEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (clearBtn) {
      clearBtn.style.display = q ? 'inline-flex' : 'none';
    }
  }

  inputEl.addEventListener('input', (e) => {
    performFilter((e.target as HTMLInputElement).value);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      inputEl.value = '';
      performFilter('');
      inputEl.focus();
    });
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticleSearch);
  } else {
    initArticleSearch();
  }
}
