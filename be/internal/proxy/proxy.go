package proxy

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

func FhirProxy() (http.Handler, error) {
	baseUrl := os.Getenv("FHIR_BASE_URL")
	if baseUrl == "" {
		return nil, fmt.Errorf("FHIR base url not set")
	}

	target, err := url.Parse(baseUrl)
	if err != nil {
		return nil, fmt.Errorf("invalid FHIR base url: %w", err)
	}

	proxy := &httputil.ReverseProxy{}
	proxy.Rewrite = func(pr *httputil.ProxyRequest) {
		pr.SetURL(target)
		pr.Out.URL.Path = strings.TrimPrefix(pr.In.URL.Path, "/api")
	}

	proxy.ModifyResponse = func(resp *http.Response) error {
		resp.Header.Del("Access-Control-Allow-Origin")
		resp.Header.Del("Access-Control-Allow-Credentials")
		resp.Header.Del("Access-Control-Allow-Headers")
		resp.Header.Del("Access-Control-Allow-Methods")
		resp.Header.Del("Access-Control-Expose-Headers")
		return nil
	}
	return proxy, nil
}
