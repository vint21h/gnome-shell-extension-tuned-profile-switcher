# tuned-profile-switcher
# Makefile


.ONESHELL:
PHONY: check compilemessages build help
NAME ?= tuned-profile-switcher@vint21h.pp.ua
GETTEXT_DOMAIN ?= tuned-profile-switcher


check:
	pre-commit run --all-files;\


compilemessages:
	for locale in `echo $(NAME)/locale/*/`; do\
		msgfmt $${locale}/LC_MESSAGES/$(GETTEXT_DOMAIN).po -o $${locale}/LC_MESSAGES/$(GETTEXT_DOMAIN).mo;\
	done;\

build:
	cp -r $(NAME) tmp;\
	for locale in `echo tmp/$(NAME)/locale/*/`; do\
		rm $${locale}/LC_MESSAGES/$(GETTEXT_DOMAIN).po;\
	done;\
	rm tmp/$(NAME)/locale/$(GETTEXT_DOMAIN).pot
	cd tmp/$(NAME);\
	zip ../$(NAME).zip * locale/*/LC_MESSAGES/*


help:
	@echo "    help:"
	@echo "        Show this help."
	@echo "    check:"
	@echo "        Perform some code checks."
	@echo "    compilemessages:"
	@echo "        Compile translations."
	@echo "    build:"
	@echo "        Pack extension."
