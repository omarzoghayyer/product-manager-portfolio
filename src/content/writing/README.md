# Writing

Each essay is one Markdown file in `posts/`.

## Add a post

1. Copy `posts/_template.md` to a new file, e.g. `posts/why-quality-is-a-product.md`.
   The file name is the URL: `/writing/why-quality-is-a-product`.
2. Fill in the frontmatter at the top:

   | Field         | Required | Notes                                                    |
   | ------------- | -------- | -------------------------------------------------------- |
   | `title`       | yes      | Post heading and list title.                             |
   | `subtitle`    | no       | Shown under the title on the article page.               |
   | `description` | no       | Excerpt on the Writing page. Falls back to `subtitle`.   |
   | `date`        | no       | `YYYY-MM-DD`. Posts are sorted newest first.             |
   | `draft`       | no       | `true` = only visible with `npm start`, hidden when live. |

3. Write the body in Markdown below the second `---`.
4. Set `draft: false` (or remove the line) when it's ready, then deploy.

Files starting with `_` are ignored. `sample-post.md` is a placeholder that only
shows in development; delete it whenever you like.
