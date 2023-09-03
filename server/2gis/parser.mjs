import axios from "axios";

class parser {
    constructor() {
        this.key = 'rurbbn3446';
        this.baseFields = ["items.links.database_entrances.apartments_info"];
        this.apiUrl = 'https://catalog.api.2gis.ru/3.0/suggests';


    }

    async getAddrInfo(lon,lat,address,start = 1, end = 9999) {
        let result = {status: "fail", lounges: []};
        try {
            let params = {
                key:this.key,
                fields:this.baseFields.join(","),
                q:address.replace(/\(.*?\)/g, ''),
                point:lon+','+lat
            }
            let answer = await axios.get(this.apiUrl, {params})
            let entrances = answer.data.result.items[0].links.database_entrances;
            let apparts = entrances.filter(_item => _item.hasOwnProperty('apartments_info'));
            apparts.forEach((_enter, _idx) => {
                let num = +_enter.entity_number;
                if (num) {
                    let _newLounge = {number: num};
                    let floors = this.generateFloor(_enter.apartments_info.floors, start, end);
                    _newLounge.floors = floors;
                    if (_newLounge.floors.length) {
                        result.lounges.push(_newLounge);
                    }
                }
            });
            result.status = "ok";
        }catch(e){
            console.log(e);
        }

        return result;
    }

    parseRange(item) {
        let type = typeof item;
        let result = [];

        if (Array.isArray(item)) {
            type = "array";
        }

        switch (type) {
            case "string":
                result.push(+item);
                break;
            case "object":
                for (let _i = item.start; _i <= item.end; _i++) {
                    result.push(_i);
                }
                break;
            case "array":
                item.forEach(_subItem => result = result.concat(this.parseRange(_subItem)));
                break;
        }

        return result;
    }

    generateFloor(floorsInfo, start, end) {
        let resultFloors = [];

        floorsInfo.forEach(_floorI => {
            let floorsRange = this.parseRange(_floorI.name);
            let apprtsRange = this.parseRange(_floorI.apartments);

            // один этаж
            if (floorsRange.length === 1) {
                let _newFloor = { number: floorsRange[0], apparts: apprtsRange };
                let filtered = apprtsRange.filter(_a => _a >= start && _a <= end);

                if (filtered.length) {
                    _newFloor.apparts = filtered;
                    resultFloors.push(_newFloor);
                }
            } else if (floorsRange.length > 1) {
                let floors = floorsRange.length;
                let appartsPerFloor = Math.round(apprtsRange.length / floors);

                floorsRange.forEach((_f, _fIdx) => {
                    let _newFloor = { number: _f, apparts: [] };
                    let _appartStart = _fIdx * appartsPerFloor;
                    let _appartEnd = _appartStart + appartsPerFloor;

                    if (_fIdx !== floorsRange.length - 1) {
                        _newFloor.apparts = apprtsRange.slice(_appartStart, _appartEnd);
                    } else {
                        _newFloor.apparts = apprtsRange.slice(_appartStart, apprtsRange.length);
                    }

                    let filtered = _newFloor.apparts.filter(_a => _a >= start && _a <= end);

                    if (filtered.length) {
                        _newFloor.apparts = filtered;
                        resultFloors.push(_newFloor);
                    }
                });
            }
        });

        return resultFloors;
    }
}

export default new parser()
