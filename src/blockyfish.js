const old = Function.prototype.bind;
let game;
const bind = function (...args) {
	if (this == console.log) {
		return old.apply(this, args);
	}
	if (Function.prototype.bind == old) {
		return old.apply(this, args);
	} else if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "currentScene")) {
		// Game object script injector
		// Made by TheJ, aka noam
		console.log("%c[TheJ Injector] Logged game object.", "color: #ff6969; font-size:125%");
		game = args[0];
		window.game = game;
	} else if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "prepareUpload")) {
		// GIF pfp upload patch injector
		// Made by Pi

		// console log throttling
		if (Date.now() - (window.pi_igpup_llts || 0) > 1000) {
			window.pi_igpup_llts = Date.now();
			console.log("%c[Pi Injector] Injected GIF pfp uploader patch.", "color: #e9c2ff; font-size:125%");
		}
		var opu = args[0].prepareUpload;
		args[0].prepareUpload = function () {
			args[0].createImgUrl = args[0].sourceImgUrl;
			return opu.apply(this);
		};
		game = args[0];
		window.game = game;
	}
	return old.apply(this, args);
};
Function.prototype.bind = bind;

class Blockyfish {
	constructor(window) {
		this.events = {
			"plugins-load": new Event("plugins-load", { bubbles: true, cancelable: false }),
			"first-game-load": new Event("first-game-load", { bubbles: true, cancelable: false }),
			"game-load": new Event("game-load", { bubbles: true, cancelable: false }),
			"play-button-click": new Event("play-button-click", { bubbles: true, cancelable: false }),
			"death": new Event("death", { bubbles: true, cancelable: false }),
			"settings-open": new Event("settings-open", { bubbles: true, cancelable: false }),
			"forums-open": new Event("forums-open", { bubbles: true, cancelable: false })
		};
		// makes it harder to tamper with blockyfish info
		this.config = window.bfi;
		window.bfi = undefined;
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
			Emote: 18
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
			Servers: 255
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
			CRequest: 19
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
			toxin: 6
		};
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
		const s = new ArrayBuffer(e != null ? (t == this.FishPacket.ScalingBoost ? 3 : 4) : 2),
			a = new DataView(s);
		if ((a.setUint8(0, this.GeneralPacket.Action), a.setUint8(1, t), null != e))
			if (t == this.FishPacket.ScalingBoost) a.setUint8(2, e);
			else {
				if (t != this.FishPacket.Emote) throw new Error("Other actions dont have value");
				a.setUint16(2, e, true);
			}
		return s;
	}
	formMovePacket(x, y, n) {
		const a = new ArrayBuffer(10),
			i = new DataView(a);
		return i.setUint8(0, 2), i.setUint32(1, x, !0), i.setUint16(5, y, !0), i.setUint8(9, Math.min(255, n)), a;
	}

	// GAME STUFF
	sendChat(message, toEveryone = true) {
		if (!message) return;
		try {
			game.socketManager.sendStringPacket(
				JSON.stringify({
					p: this.GeneralPacket.ChatMessage,
					te: toEveryone,
					message: message
				})
			);
		} catch {}
	}
}

module.exports = { Blockyfish };
