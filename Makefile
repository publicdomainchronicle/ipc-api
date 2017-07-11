SHELL := /bin/bash

FILES=ipc_scheme ipc_catchwordindex
RELEASE=20170101

all: $(addprefix data/,$(addsuffix .json,$(FILES)))

data:
	mkdir -p data

.INTERMEDIATE: data/tmp

data/tmp:
	mkdir -p $@

.PRECIOUS: data/%.zip data/%.xml

data/%.zip: | data
	curl -o "$@" "http://www.wipo.int/ipc/itos4ipc/ITSupport_and_download_area/$(RELEASE)/MasterFiles/$*_$(RELEASE).zip"

data/%.xml: data/%.zip | data data/tmp
	mkdir -p data/tmp
	unzip -d data/tmp $<
	mv data/tmp/EN* "data/$*.xml"
	rm -rf data/tmp

data/%.json: data/%.xml parse/%
	parse/$* < $< > $@
