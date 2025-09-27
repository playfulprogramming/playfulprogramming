# syntax=docker/dockerfile:1
FROM flyio/flyctl:latest as flyio
FROM alpine:3.22

RUN apk --update add ca-certificates jq bash

COPY <<"EOF" /srv/deploy.sh
#!/bin/bash
deploy=(flyctl deploy)

while read -r secret; do
  deploy+=(--build-secret "${secret}=${!secret}")
done < <(flyctl secrets list --json | jq -r ".[].Name")

${deploy[@]}
EOF

RUN chmod +x /srv/deploy.sh

COPY --from=flyio /flyctl /usr/bin

WORKDIR /build
COPY . .

