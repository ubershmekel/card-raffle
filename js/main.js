(function () {
    function getParams() {
        var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query = window.location.search.substring(1);

        var urlParams = {};
        while (match = search.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    }

    var defaultData = {
        // text: "This could be your business card.\nModify it, bookmark it.\nLet others snap a picture.",
        // color: "#fff",
        // background: "#2bf",
        // fontSize: "3vw",
        index: 0,
        seed: 1234,
        cards: [
            {
                text: "Wolf",
                amount: 2,
            },
            {
                text: "Villager",
                amount: 8,
            },
            {
                text: "Seer",
                amount: 1,
            },
            {
                text: "Healer",
                amount: 1,
            },
        ],
    };

    // window.fitText(document.getElementById("text"));
    var app = new Vue({
        el: '#the-app',
        data: defaultData,
        created() {
            // console.log("query", window.location.search);
            var params = getParams();
            var keys = Object.keys(defaultData);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (params[key]) {
                    this[key] = JSON.parse(params[key]);
                }
            }
        },
        methods: {
            shuffle() {
                this.seed = Math.floor(Math.random() * 10000);
            },
            sortedDeck() {
                const deck = [];
                for (const set of this.cards) {
                    for (let i = 0; i < set.amount; i++) {
                        deck.push(set.text);
                    }
                }
                return deck;
            },
            shuffledDeck() {
                const full = this.sortedDeck();
                const shuffled = [];
                for (let i = 0; i < full.length; i++) {
                    const decider = Math.floor(Math.pow((i + 13) * this.seed, 1.6)) % (shuffled.length + 1);
                    const tmp = shuffled[decider];
                    if (tmp) {
                        shuffled.push(tmp);
                    }
                    shuffled[decider] = full[i];
                }
                return shuffled;
            },
            currentCardText() {
                return this.shuffledDeck()[this.index];
            },
            next() {
                this.index = (this.index + 1) % this.sortedDeck().length;
            },
            prev() {
                const len = this.sortedDeck().length;
                // JS negative modulo stays negative. So adding `len` to negate that.
                this.index = (len + this.index - 1) % len;
            },
            removeCard(index) {
                if (this.cards.length === 1) {
                    return;
                }
                this.cards.splice(index, 1);
            },
            addCard() {
                this.cards.push({
                    text: '',
                    amount: 1,
                })
            }
        },
        watch: {
            $data: {
                handler: function (val, oldVal) {
                    // console.log("changed", val);
                    var keys = Object.keys(defaultData);
                    keys.sort();
                    var query = '?' + keys
                        .map(k =>
                            encodeURIComponent(k) + '=' + encodeURIComponent(JSON.stringify(this[k]))
                        )
                        .join('&');
                    // console.log("query url built", query);
                    history.replaceState({}, "", query);
                },
                deep: true
            }
        },
    })
})();