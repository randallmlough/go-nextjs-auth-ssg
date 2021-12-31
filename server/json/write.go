package json

import (
	"encoding/json"
	"net/http"
)

type Envelope map[string]interface{}

func Write(w http.ResponseWriter, status int, data Envelope, headers http.Header) error {

	js, err := marshall(data)
	if err != nil {
		return err
	}

	for key, value := range headers {
		w.Header()[key] = value
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if _, err := w.Write(js); err != nil {
		return err
	}
	return nil
}

func marshall(data Envelope) ([]byte, error) {
	js, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	js = append(js, '\n')
	return js, nil
}
