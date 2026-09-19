export const siteConfig = {
  name: "INIT",
  email: "post@initconsulting.no",
  linkedin: "https://www.linkedin.com/company/110150651/",
  /**
   * The portrait on the about page, as a path inside `public/`.
   *
   * There is no photo in the repository yet. Drop a square image at
   * `public/henrik.jpg` (or any path) and set it here, and it appears. While
   * this is null the about page draws the mark in its place, so the page is
   * never missing a block and nothing 404s.
   */
  portrait: null as string | null,
  emailSubject: {
    no: "Forespørsel om utviklingsoppdrag",
    en: "Development enquiry",
  },
};
