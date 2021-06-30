# tuned-profile-switcher
# Makefile


.ONESHELL:
PHONY: check help


check:
	pre-commit run --all-files;\


help:
	@echo "    help:"
	@echo "        Show this help."
	@echo "    check:"
	@echo "        Perform some code checks."
