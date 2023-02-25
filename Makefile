.PHONY: run build int-test unit-test lint

build:
	npm run build

run:
	npm start

docker-build:
	docker build -t madmmasud/nitto_spms_nginx:latest .

docker-scan: docker-build
	docker scan madmmasud/nitto_spms_nginx:latest

docker-push: docker-build
	docker push madmmasud/nitto_spms_nginx:latest
