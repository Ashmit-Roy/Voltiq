from setuptools import setup, find_packages

setup(
    name="forecasting-prediction-engine",
    version="1.0.0",
    description="Modular time-series forecasting and trend prediction engine.",
    author="PS-07 Team",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "numpy>=1.26.0",
        "pydantic>=2.0.0"
    ],
    python_requires=">=3.8",
)
