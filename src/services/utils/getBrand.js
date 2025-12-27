export function getBrandBaseURL() {
  const hostname = window.location.hostname;

  // Example: prolific.myapp.com → prolific
  const subdomain = hostname.split(".")[0];

  // Map subdomains to correct brand routes
  const brandMap = {
    prolific: "brand-prolific",
    doktari: "brand-doktari",
  };

  return brandMap[subdomain] ? `/${brandMap[subdomain]}` : "/"; // default fallback
}
