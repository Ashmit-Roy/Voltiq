from setuptools import setup, find_packages

setup(
    name="universal-data-ingestion",
    version="1.0.0",
    description="Universal telemetry ingestion and normalization engine for IoT and time-series metrics.",
    author="PS-07 Team",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "pydantic>=2.0.0",
        "pandas>=2.0.0"
    ],
    python_requires=">=3.8",
)
