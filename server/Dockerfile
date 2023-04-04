# ================================
# Build image
# ================================
FROM swift:5.6-focal as build

# Install OS updates and, if needed, sqlite3
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true \
    && apt-get -q update \
    && apt-get -q dist-upgrade -y \
    && apt-get install -y libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up a build area
WORKDIR /build

# First just resolve dependencies.
# This creates a cached layer that can be reused
# as long as your Package.swift/Package.resolved
# files do not change.
COPY ./Package.* ./
RUN swift package resolve

# Copy entire repo into container
COPY . .

# Build everything, with optimizations
RUN swift build -c release --static-swift-stdlib

# Switch to the staging area
WORKDIR /staging

# Copy main executable to staging area
RUN cp "$(swift build --package-path /build -c release --show-bin-path)/Run" ./

# Copy resources bundled by SPM to staging area
RUN find -L "$(swift build --package-path /build -c release --show-bin-path)/" -regex '.*\.resources$' -exec cp -Ra {} ./ \;

# Copy any resources from the public directory and views directory if the directories exist
# Ensure that by default, neither the directory nor any of its contents are writable.
RUN [ -d /build/Public ] && { mv /build/Public ./Public && chmod -R a-w ./Public; } || true
RUN [ -d /build/Resources ] && { mv /build/Resources ./Resources && chmod -R a-w ./Resources; } || true

# ================================
# Build sqlite 3.37.2
# ================================
FROM debian:11-slim as build-sqlite

ARG SQLITE_VERSION=3370200

# Make sure all system packages are up to date and install sqlite3’s dependencies.
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true \
	&& apt-get -q update \
	&& apt-get -q dist-upgrade -y \
	&& apt-get install -y \
		build-essential \
		ca-certificates \
		clang \
		openssl \
		tcl-dev \
		unzip \
		wget \
	&& rm -rf /var/lib/apt/lists/*

RUN wget "https://sqlite.org/2022/sqlite-src-$SQLITE_VERSION.zip" \
	&& unzip "sqlite-src-$SQLITE_VERSION.zip"
RUN cd "sqlite-src-$SQLITE_VERSION" \
	&& ./configure --prefix=/sqlite-build --disable-tcl --disable-readline --without-tcl \
	&& make install
RUN tar -C /sqlite-build -cvf /sqlite.tar.bz2 .

# ================================
# Run image
# ================================
FROM debian:11-slim

# Make sure all system packages are up to date.
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && \
    apt-get -q update && apt-get -q dist-upgrade -y && apt-get -q install -y ca-certificates tzdata && \
    rm -r /var/lib/apt/lists/*

# Install sqlite3 from builder-sqlite
COPY --from=build-sqlite /sqlite.tar.bz2 /sqlite.tar.bz2
RUN cd / && tar xvf sqlite.tar.bz2 && rm sqlite.tar.bz2

# Create a vapor user and group with /app as its home directory
RUN useradd --user-group --create-home --system --skel /dev/null --home-dir /app vapor

# Switch to the new home directory
WORKDIR /app

# Copy built executable and any staged resources from builder
COPY --from=build --chown=vapor:vapor /staging /app

# Ensure all further commands run as the vapor user
USER vapor:vapor

# Let Docker bind to port 8080
EXPOSE 8080

# Start the Vapor service when the image is run, default to listening on 8080 in production environment
ENTRYPOINT ["./Run"]
CMD ["serve", "--env", "production", "--hostname", "0.0.0.0", "--port", "8080"]
