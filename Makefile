# tuned-profile-switcher
# Makefile


.ONESHELL:
PHONY: check compilemessages help
NAME ?= tuned-profile-switcher@vint21h.pp.ua


check:
	pre-commit run --all-files;\


compilemessages:
	for locale in `echo $(NAME)/locale/*/`; do\
		msgfmt $${locale}/LC_MESSAGES/tuned-profile-switcher.po -o $${locale}/LC_MESSAGES/tuned-profile-switcher.mo;\
	done;\


help:
	@echo "    help:"
	@echo "        Show this help."
	@echo "    check:"
	@echo "        Perform some code checks."
	@echo "    compilemessages:"
	@echo "        Compile translations."
