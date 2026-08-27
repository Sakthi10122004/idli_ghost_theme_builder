import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<style>
  #newsletter-${block.id} {
    background-color: var(--color-bg);
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: space-between;
  }
  @media (min-width: 768px) {
    #newsletter-${block.id} {
      flex-direction: row;
    }
  }
  #newsletter-${block.id} .newsletter-text {
    flex-grow: 1;
  }
  #newsletter-${block.id} .newsletter-title {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: bold;
    margin: 0;
  }
  #newsletter-${block.id} .newsletter-subtitle {
    font-size: 0.75rem;
    color: var(--color-muted);
    margin: 0;
  }
  #newsletter-${block.id} .newsletter-form {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }
  @media (min-width: 768px) {
    #newsletter-${block.id} .newsletter-form {
      width: auto;
    }
  }
  #newsletter-${block.id} .input-field {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: var(--radius-sm);
    flex-grow: 1;
  }
  #newsletter-${block.id} .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: var(--radius-pill);
    background-color: var(--color-primary);
    color: #ffffff;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  #newsletter-${block.id} .btn-primary:hover {
    opacity: 0.85;
  }
</style>
<div id="newsletter-${block.id}" class="newsletter-block">
  <div class="newsletter-text">
    <h3 class="newsletter-title">${block.props.title || "Join our technical newsletter"}</h3>
    <p class="newsletter-subtitle">Stay up to date with new features and tutorials.</p>
  </div>
  <form class="newsletter-form">
    <input type="email" placeholder="${block.props.placeholder || 'you@domain.com'}" required class="input-field" />
    <button type="submit" class="btn-primary shrink-0">${block.props.buttonLabel || 'Subscribe'}</button>
  </form>
</div>`;
};