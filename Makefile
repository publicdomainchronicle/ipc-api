FILES=ipc_scheme ipc_catchwordindex ipc_tree
RELEASE=20170101

all: $(addprefix data/,$(addsuffix .json,$(FILES))) data/ipc_tree.json

data:
	mkdir -p data

.INTERMEDIATE: data/tmp

data/tmp:
	mkdir -p $@

.PRECIOUS: data/%.zip

data/%.zip: | data
	curl -o "$@" "http://www.wipo.int/ipc/itos4ipc/ITSupport_and_download_area/$(RELEASE)/MasterFiles/$*_$(RELEASE).zip"

data/%.xml: data/%.zip | data data/tmp
	mkdir -p data/tmp
	unzip -d data/tmp $<
	mv data/tmp/EN* "data/$*.xml"
	rm -rf data/tmp

data/%.json: data/%.xml parse/%
	parse/$* < $< > $@

data/ipc_tree.json: data/ipc_scheme.json
	parse/scheme-to-tree < $< > $@
