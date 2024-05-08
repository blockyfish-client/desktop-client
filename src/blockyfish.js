const old = Function.prototype.bind;
let game;
if (!window.bfe) {
	window.bfe = {};
}
window.bfe.firstLoad = true;
const bind = function (...args) {
	if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "currentScene")) {
		// Game object script injector
		// Made by TheJ, aka noam
		console.log("%c[TheJ Injector] Logged game object.", "color: #ff6969; font-size:125%");
		game = args[0];
		window.game = game;
		try {
			// game-load event
			// first-game-load event
			window.blockyfish.emit("any-game-load");
			if (window.bfe.firstLoad) {
				window.blockyfish.emit("first-game-load");
			} else {
				window.blockyfish.emit("game-load");
			}
			window.bfe.firstLoad = false;
		} catch {}
	} else if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "prepareUpload")) {
		// GIF pfp upload patch injector
		// Made by Pi

		// console log throttling
		if (Date.now() - (window.pi_igpup_llts || 0) > 1000) {
			window.pi_igpup_llts = Date.now();
			console.log("%c[Pi Injector] Injected GIF pfp uploader patch.", "color: #e9c2ff; font-size:125%");
		}
		const opu = args[0].prepareUpload;
		args[0].prepareUpload = function () {
			args[0].createImgUrl = args[0].sourceImgUrl;
			return opu.apply(this);
		};
	}
	return old.apply(this, args);
};
Function.prototype.bind = bind;

class Blockyfish {
	constructor(window) {
		this.events = {
			"plugins-load": new Event("plugins-load", {
				bubbles: true,
				cancelable: false,
			}),
			"first-game-load": new Event("first-game-load", {
				bubbles: true,
				cancelable: false,
			}),
			"game-load": new Event("game-load", {
				bubbles: true,
				cancelable: false,
			}),
			"any-game-load": new Event("any-game-load", {
				bubbles: true,
				cancelable: false,
			}),
			"play-button-click": new Event("play-button-click", {
				bubbles: true,
				cancelable: false,
			}),
			death: new Event("death", { bubbles: true, cancelable: false }),
			"settings-open": new Event("settings-open", {
				bubbles: true,
				cancelable: false,
			}),
			"signin-open": new Event("signin-open", {
				bubbles: true,
				cancelable: false,
			}),
			"forums-open": new Event("forums-open", {
				bubbles: true,
				cancelable: false,
			}),
		};
		// makes it harder to tamper with blockyfish info
		this.config = window.bfi;
		this.Animals = {
			0: "fish",
			1: "crab",
			2: "jellyfish",
			3: "squid",
			4: "seagull",
			5: "ray",
			6: "beaver",
			7: "penguin",
			8: "tshark",
			9: "dolphin",
			10: "shark",
			11: "killerwhale",
			12: "whale",
			13: "worm",
			14: "anglerfish",
			15: "leopardseal",
			16: "blobfish",
			17: "kingcrab",
			18: "pollock",
			19: "seaturtle",
			20: "oarfish",
			21: "octopus",
			22: "giantsquid",
			23: "narwhal",
			24: "cachalot",
			25: "polarbear",
			26: "lamprey",
			27: "pelican",
			28: "whaleshark",
			29: "remora",
			30: "marlin",
			31: "sunfish",
			32: "stonefish",
			33: "ghost",
			34: "crocodile",
			35: "electriceel",
			36: "frog",
			37: "hippo",
			38: "manatee",
			39: "snappingturtle",
			40: "piranha",
			41: "snake",
			42: "baldeagle",
			43: "lionfish",
			44: "dragonfly",
			45: "mantaray",
			46: "elephantseal",
			47: "lanternfish",
			48: "sleepershark",
			49: "gulpereel",
			50: "giantisopod",
			51: "giantisopodclosed",
			52: "babypenguin",
			53: "seal",
			54: "icefish",
			55: "barreleye",
			56: "dragonfish",
			57: "humboldtsquid",
			58: "sealion",
			59: "flyingfish",
			60: "duck",
			61: "goblinshark",
			62: "catfish",
			63: "littleauk",
			64: "pufferfish",
			65: "pufferfishfilled",
			66: "tigershark",
			67: "lionmanejellyfish",
			68: "anaconda",
			69: "bobbitworm",
			70: "mahimahi",
			71: "walrus",
			72: "frilledshark",
			73: "sawfish",
			74: "mantisshrimp",
			75: "axolotl",
			76: "bat",
			77: "firefly",
			78: "blindcavefish",
			79: "crayfish",
			80: "goliathbullfrog",
			81: "giantsalamander",
			82: "alligatorsnappingturtle",
			83: "giantsoftshellturtle",
			84: "giantsoftshellturtleclosed",
			85: "olm",
			86: "alligatorgar",
			87: "humpbackwhale",
			88: "sardine",
			89: "horseshoecrab",
			90: "baskingshark",
			91: "colossalsquid",
			92: "climbingcavefish",
			93: "archerfish",
			94: "seaotter",
			95: "lobster",
			96: "barracuda",
			97: "frogfish",
			98: "morayeel",
			99: "wobbegongshark",
			100: "leatherbackturtle",
			101: "threshershark",
			102: "atlantictorpedo",
			103: "coconutcrab",
			104: "bullshark",
			105: "hermitcrab",
			106: "giantpacificoctopus",
			107: "beakedwhale",
			108: "megamouthshark",
			109: "belugawhale",
			110: "vampiresquid",
			111: "halibut",
			112: "bowheadwhale",
			113: "japanesespidercrab",
			114: "cookiecuttershark",
			115: "sarcasticfringehead",
			116: "parrotfish",
			117: "wolfeel",
			118: "giantsinophore",
			119: "coelacanth",
			120: "napoleonwrasse",
			fish: 0,
			crab: 1,
			jellyfish: 2,
			squid: 3,
			seagull: 4,
			ray: 5,
			beaver: 6,
			penguin: 7,
			tshark: 8,
			dolphin: 9,
			shark: 10,
			killerwhale: 11,
			whale: 12,
			worm: 13,
			anglerfish: 14,
			leopardseal: 15,
			blobfish: 16,
			kingcrab: 17,
			pollock: 18,
			seaturtle: 19,
			oarfish: 20,
			octopus: 21,
			giantsquid: 22,
			narwhal: 23,
			cachalot: 24,
			polarbear: 25,
			lamprey: 26,
			pelican: 27,
			whaleshark: 28,
			remora: 29,
			marlin: 30,
			sunfish: 31,
			stonefish: 32,
			ghost: 33,
			crocodile: 34,
			electriceel: 35,
			frog: 36,
			hippo: 37,
			manatee: 38,
			snappingturtle: 39,
			piranha: 40,
			snake: 41,
			baldeagle: 42,
			lionfish: 43,
			dragonfly: 44,
			mantaray: 45,
			elephantseal: 46,
			lanternfish: 47,
			sleepershark: 48,
			gulpereel: 49,
			giantisopod: 50,
			giantisopodclosed: 51,
			babypenguin: 52,
			seal: 53,
			icefish: 54,
			barreleye: 55,
			dragonfish: 56,
			humboldtsquid: 57,
			sealion: 58,
			flyingfish: 59,
			duck: 60,
			goblinshark: 61,
			catfish: 62,
			littleauk: 63,
			pufferfish: 64,
			pufferfishfilled: 65,
			tigershark: 66,
			lionmanejellyfish: 67,
			anaconda: 68,
			bobbitworm: 69,
			mahimahi: 70,
			walrus: 71,
			frilledshark: 72,
			sawfish: 73,
			mantisshrimp: 74,
			axolotl: 75,
			bat: 76,
			firefly: 77,
			blindcavefish: 78,
			crayfish: 79,
			goliathbullfrog: 80,
			giantsalamander: 81,
			alligatorsnappingturtle: 82,
			giantsoftshellturtle: 83,
			giantsoftshellturtleclosed: 84,
			olm: 85,
			alligatorgar: 86,
			humpbackwhale: 87,
			sardine: 88,
			horseshoecrab: 89,
			baskingshark: 90,
			colossalsquid: 91,
			climbingcavefish: 92,
			archerfish: 93,
			seaotter: 94,
			lobster: 95,
			barracuda: 96,
			frogfish: 97,
			morayeel: 98,
			wobbegongshark: 99,
			leatherbackturtle: 100,
			threshershark: 101,
			atlantictorpedo: 102,
			coconutcrab: 103,
			bullshark: 104,
			hermitcrab: 105,
			giantpacificoctopus: 106,
			beakedwhale: 107,
			megamouthshark: 108,
			belugawhale: 109,
			vampiresquid: 110,
			halibut: 111,
			bowheadwhale: 112,
			japanesespidercrab: 113,
			cookiecuttershark: 114,
			sarcasticfringehead: 115,
			parrotfish: 116,
			wolfeel: 117,
			giantsinophore: 118,
			coelacanth: 119,
			napoleonwrasse: 120,
		};
		this.FishPacket = {
			1: "Boost",
			2: "Skill",
			3: "QuitRoom",
			4: "SecondaryAbility",
			5: "ScalingBoost",
			6: "IsChargingBoost",
			7: "StopChargingBoost",
			8: "HumpbackSong",
			9: "ChangeSkin",
			10: "LogOut",
			11: "ShowUser",
			12: "BlockedDamage",
			13: "ReturnedDamage",
			14: "MeleeAttack",
			15: "SpitBones",
			16: "BullsharkScar",
			17: "Emoji",
			18: "Emote",
			19: "Chat",
			20: "Request",
			Boost: 1,
			Skill: 2,
			QuitRoom: 3,
			SecondaryAbility: 4,
			ScalingBoost: 5,
			IsChargingBoost: 6,
			StopChargingBoost: 7,
			HumpbackSong: 8,
			ChangeSkin: 9,
			LogOut: 10,
			ShowUser: 11,
			BlockedDamage: 12,
			ReturnedDamage: 13,
			MeleeAttack: 14,
			SpitBones: 15,
			BullsharkScar: 16,
			Emoji: 17,
			Emote: 18,
			Chat: 19,
			Request: 20,
		};
		this.GeneralPacket = {
			1: "Play",
			2: "MoveToXY",
			3: "Action",
			4: "ChatMessage",
			6: "Login",
			7: "Evolution",
			8: "Ping",
			10: "SelectServer",
			11: "Request",
			12: "Click",
			14: "PointAngle",
			15: "CreateTribe",
			16: "QuitTribe",
			17: "RequestTribeInfo",
			18: "JoinTribeRequest",
			19: "AcceptTribeJoinRequest",
			20: "RefuseTribeJoinRequest",
			21: "TribeKick",
			22: "ReSelectServer",
			23: "ClientReady",
			24: "ClientGameSession",
			25: "VerifiedAction",
			101: "UpdateFish",
			102: "UpdateFood",
			103: "Ranking",
			104: "UpdateDamageableFood",
			105: "ChatMessages",
			106: "Terrains",
			107: "NewEntity",
			108: "UpdateHideSpaces",
			109: "ServerMessage",
			110: "PlayHistory",
			111: "Choices",
			112: "FishPositions",
			113: "Kills",
			114: "Response",
			115: "Attack",
			116: "LockOn",
			117: "Xp",
			118: "HealthDelta",
			119: "EntityAction",
			120: "TribeInfo",
			121: "MinimapPositions",
			122: "CPacket",
			123: "UpdateEntities",
			124: "HeatMap",
			125: "CustomAnimalData",
			126: "PDPlayers",
			127: "PDState",
			128: "PlayerData",
			129: "PDRanking",
			130: "OVOPlayers",
			131: "GameSession",
			244: "RoomPlayers",
			245: "WinnerPlayer",
			246: "Message",
			247: "SimpleNotification",
			248: "PlayerStatus",
			249: "Room",
			250: "Welcome",
			251: "MapPacket",
			252: "RoomInfo",
			253: "ServerStats",
			254: "ServerInfo",
			255: "Servers",
			1020: "Pong",
			1030: "Entities",
			1090: "Event",
			1110: "PlayStats",
			3000: "Move",
			7000: "Key",
			Play: 1,
			MoveToXY: 2,
			Move: 3000,
			Action: 3,
			ChatMessage: 4,
			Login: 6,
			Key: 7000,
			Evolution: 7,
			Ping: 8,
			SelectServer: 10,
			Request: 11,
			Click: 12,
			PointAngle: 14,
			CreateTribe: 15,
			QuitTribe: 16,
			RequestTribeInfo: 17,
			JoinTribeRequest: 18,
			AcceptTribeJoinRequest: 19,
			RefuseTribeJoinRequest: 20,
			TribeKick: 21,
			ReSelectServer: 22,
			ClientReady: 23,
			ClientGameSession: 24,
			VerifiedAction: 25,
			UpdateFish: 101,
			UpdateFood: 102,
			UpdateDamageableFood: 104,
			Pong: 1020,
			Entities: 1030,
			ChatMessages: 105,
			Terrains: 106,
			NewEntity: 107,
			UpdateHideSpaces: 108,
			Event: 1090,
			PlayHistory: 110,
			Choices: 111,
			PlayStats: 1110,
			ServerMessage: 109,
			FishPositions: 112,
			Kills: 113,
			Ranking: 103,
			Response: 114,
			Attack: 115,
			LockOn: 116,
			Xp: 117,
			HealthDelta: 118,
			EntityAction: 119,
			TribeInfo: 120,
			MinimapPositions: 121,
			CPacket: 122,
			UpdateEntities: 123,
			HeatMap: 124,
			CustomAnimalData: 125,
			PDPlayers: 126,
			PDState: 127,
			PlayerData: 128,
			PDRanking: 129,
			OVOPlayers: 130,
			GameSession: 131,
			RoomPlayers: 244,
			WinnerPlayer: 245,
			Message: 246,
			SimpleNotification: 247,
			PlayerStatus: 248,
			Room: 249,
			Welcome: 250,
			MapPacket: 251,
			RoomInfo: 252,
			ServerStats: 253,
			ServerInfo: 254,
			Servers: 255,
		};
		this.RequestPacket = {
			1: "JoinRoom",
			2: "CreateRoom",
			3: "FindMatch",
			4: "GetServerInfo",
			5: "GetServerStats",
			6: "ClientReady",
			7: "Reconnect",
			8: "Play",
			9: "Ping",
			10: "AnimalAction",
			11: "ChangeSide",
			12: "ChooseAnimal",
			13: "GetPlayerData",
			14: "CreateTribe",
			15: "GetTribeInfo",
			16: "JoinTribe",
			17: "TribeKick",
			18: "TribeQuit",
			19: "CRequest",
			JoinRoom: 1,
			CreateRoom: 2,
			FindMatch: 3,
			GetServerInfo: 4,
			GetServerStats: 5,
			ClientReady: 6,
			Reconnect: 7,
			Play: 8,
			Ping: 9,
			AnimalAction: 10,
			ChangeSide: 11,
			ChooseAnimal: 12,
			GetPlayerData: 13,
			CreateTribe: 14,
			GetTribeInfo: 15,
			JoinTribe: 16,
			TribeKick: 17,
			TribeQuit: 18,
			CRequest: 19,
		};
		this.DeathType = {
			1: "lackOfOxygen",
			2: "eaten",
			3: "disconnected",
			4: "temperature",
			5: "pressure",
			6: "toxin",
			lackOfOxygen: 1,
			eaten: 2,
			disconnected: 3,
			temperature: 4,
			pressure: 5,
			toxin: 6,
		};

		(() => {
			const This = this;
			const inter = setInterval(() => {
				if (!document.getElementById("app")) return;
				const vnode = document.getElementById("app")._vnode;
				if (!vnode) return;
				const states = vnode.appContext?.config?.globalProperties?.$simpleState?.states;
				if (!states) return;
				const gameState = states.find((v) => v._storeMeta.id === "game");
				if (!gameState) return;
				This.gameState = gameState;
				clearInterval(inter);
			});
		})();
	}
	emit(event) {
		if (!this.events[event]) return false;
		document.dispatchEvent(this.events[event]);
		return true;
	}
	addEventListener(event, callback) {
		if (!this.events[event] || !callback) return false;
		document.addEventListener(event, callback);
		return true;
	}
	removeEventListener(event, callback) {
		if (!this.events[event] || !callback) return false;
		document.removeEventListener(event, callback);
		return true;
	}
	getVersion() {
		return this.config.version;
	}
	getVersionNumber() {
		return this.config.versionNumber;
	}

	// GAME METHODS
	// CORE PACKET STUFF
	formBytePacket(t, e = null) {
		const s = new ArrayBuffer(e != null ? (t === this.FishPacket.ScalingBoost ? 3 : 4) : 2);
		const a = new DataView(s);
		a.setUint8(0, this.GeneralPacket.Action);
		a.setUint8(1, t);
		if (null != e)
			if (t === this.FishPacket.ScalingBoost) a.setUint8(2, e);
			else {
				if (t !== this.FishPacket.Emote) throw new Error("Other actions dont have value");
				a.setUint16(2, e, true);
			}
		return s;
	}
	formMovePacket(x, y, n) {
		const a = new ArrayBuffer(10);
		const i = new DataView(a);
		i.setUint8(0, 2);
		i.setUint32(1, x, !0);
		i.setUint16(5, y, !0);
		i.setUint8(9, Math.min(255, n));
		return a;
	}

	// GAME STUFF
	sendChat(message, toEveryone = true) {
		if (!message) return;
		if (!this.gameState)
			try {
				this.gameState = document
					.getElementById("app")
					._vnode.appContext.config.globalProperties.$simpleState.states.find((v) => v._storeMeta.id === "game");
			} catch (e) {}
		if (!this.gameState) return;
		try {
			game.socketManager.sendBytePacket(this.encrypt(this.gameState.token, this.FishPacket.Chat, toEveryone ? "1" : `0${message}`));
		} catch {}
	}

	encrypt(t, e, n = "") {
		if (!t) return null;
		const a = ((A, B) => {
			const enc = new TextEncoder();
			const a = enc.encode(A);
			const i = enc.encode(B);
			const r = new Uint8Array(a.length);
			for (let o = 0; o < a.length; o++) r[o] = a[o] ^ i[o % i.length];
			return btoa(String.fromCharCode(...r));
		})(String.fromCharCode(e).repeat(3) + n, t);
		const i = new TextEncoder().encode(a);
		const r = 1 + i.byteLength + 1;
		const o = new ArrayBuffer(r);
		const l = new DataView(o);

		l.setUint8(0, 25);
		new Uint8Array(o).set(i, 1);
		l.setUint8(r - 1, e);
		return o;
	}
}

module.exports = { Blockyfish };
