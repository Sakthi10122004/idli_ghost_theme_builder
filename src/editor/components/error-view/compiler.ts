export const compileToHbs = () => {
  return `<div class="error-view-block py-16 text-center">
  <h1 style="font-size: 4rem; font-weight: 700; margin: 0; color: #171717;">{{#if statusCode}}{{statusCode}}{{else}}404{{/if}}</h1>
  <p style="font-size: 1rem; color: #888888; margin-top: 1rem;">{{#if message}}{{message}}{{else}}Page not found{{/if}}</p>
  <a href="{{@site.url}}" class="btn btn-primary" style="margin-top: 1.5rem;">Go to Home</a>
</div>`;
};