# GenomicsPy - Python Genomics Toolkit

A comprehensive Python toolkit for NGS data analysis, variant calling, and genomic visualization.

## 📋 Features

- **Sequence Analysis**: DNA/RNA sequence manipulation and analysis
- **Variant Calling**: SNP and INDEL detection from NGS data
- **Quality Control**: FastQ quality assessment and filtering
- **Visualization**: Interactive genomic plots and charts
- **Format Conversion**: Support for multiple genomic file formats

## 🚀 Installation

```bash
pip install genomicspy
```

Or install from source:

```bash
git clone https://github.com/genomicspy/genomicspy.git
cd genomicspy
pip install -e .
```

## 📖 Quick Start

```python
import genomicspy as gp

# Load a VCF file
vcf_data = gp.load_vcf("sample.vcf")

# Basic statistics
stats = gp.variant_stats(vcf_data)
print(f"Total variants: {stats['total_variants']}")

# Quality filtering
filtered_variants = gp.filter_quality(vcf_data, min_qual=30)

# Visualization
gp.plot_variant_distribution(filtered_variants)
```

## 📊 Example Data Analysis

See the `examples/` directory for complete analysis workflows:

- `variant_analysis.py` - SNP/INDEL analysis pipeline
- `quality_control.py` - FastQ quality assessment
- `visualization_examples.py` - Plotting genomic data

## 🔬 FAIR Data Principles

This software package follows FAIR principles:

### Findable
- ✅ DOI: `10.5281/zenodo.genomicspy.v1.0`
- ✅ GitHub repository with comprehensive documentation
- ✅ PyPI package with searchable metadata

### Accessible
- ✅ MIT License (open source)
- ✅ Multi-platform support (Windows, macOS, Linux)
- ✅ Docker containers available

### Interoperable
- ✅ Standard file format support (VCF, SAM/BAM, FastQ)
- ✅ RESTful API for integration
- ✅ Plugin architecture for extensions

### Reusable
- ✅ Comprehensive documentation
- ✅ Unit tests (95% coverage)
- ✅ Continuous integration (CI/CD)

## 📄 Documentation

Full documentation is available at: https://genomicspy.readthedocs.io

## 📝 Citation

```bibtex
@software{genomicspy2024,
  title={GenomicsPy: Python Genomics Toolkit},
  author={Smith, John and Doe, Jane},
  year={2024},
  publisher={GitHub},
  doi={10.5281/zenodo.genomicspy.v1.0},
  url={https://github.com/genomicspy/genomicspy}
}
```

## 📞 Support

- 📧 Email: support@genomicspy.org
- 💬 GitHub Issues: https://github.com/genomicspy/genomicspy/issues
- 📖 Documentation: https://genomicspy.readthedocs.io

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.