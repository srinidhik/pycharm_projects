#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Events.settings")

    import django.core.management

    django.core.management.execute_from_command_line(sys.argv)
