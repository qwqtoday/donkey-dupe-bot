import { Chest, createBot } from "mineflayer";
import { Window } from "prismarine-windows";
import { setTimeout as sleep } from "timers/promises";

const bot = createBot({
    host: "8b8t.me", 
    port: 25565, 
    auth: "microsoft",
    username: "NaughtyCatgirl",
})

bot.once("spawn", () => {
    bot.chat("/server 8b8t");
})

bot.on("chat", async (sender, message) => {
    if (sender === bot.username) return;
    console.log(sender, message)
    if (sender !== "AdorableSmallCat") return;

    if (message.startsWith("!dupe")) {
        try {
            bot.dismount();
        } catch {}
        bot.chat("/home donkey")
        const donkey = bot.nearestEntity(entity => entity.entityType === bot.registry.entitiesByName.donkey.id && entity.position.distanceTo(bot.entity.position) < 4);
        if (donkey === null) {
            bot.whisper(sender, "No donkey found nearby.");
            return;
        }
        const donkeyPosition = donkey.position.clone();

        
        bot.whisper(sender, "Attempting to dupe...");
        
        const windowHandler = async (window: Window) => {
            if (window.type === "minecraft:generic_9x2") {
                console.log(window)
                bot.removeListener("windowOpen", windowHandler)
                while (donkeyPosition.distanceTo(bot.entity.vehicle.position) < 128) {
                    await sleep(100)
                }
                console.log("transferring items")
                window.containerItems().forEach(item => {
                        bot.transfer({
                            window: window, 
                            itemType: item.type,
                            count: item.count,
                            metadata: null,
                            sourceStart: 0,
                            sourceEnd: 17,
                            destStart: 18,
                            destEnd: 54
                        }).catch(console.log)
                    })
                
                
                bot.dismount();
            }
        }

        bot.on("windowOpen", windowHandler);

        bot.setControlState("sneak", true);
        await bot.waitForTicks(60);
        
        try {
            bot.mount(donkey);
        } catch {}
        await bot.waitForTicks(3);

        bot.setControlState("sneak", false);
        
        bot.chat("/home awaydonkey")
        await bot.waitForTicks(10);
        const minecart = bot.nearestEntity(entity => entity.entityType === bot.registry.entitiesByName.minecart.id && entity.position.distanceTo(bot.entity.position) < 4);
        if (minecart === null) {
            bot.whisper(sender, "No minecart found nearby.");
            return;
        }

        bot.mount(minecart)

    } else if (message.startsWith("!dismount")) {
        try {
            bot.dismount();
        } catch {
            bot.whisper(sender, "Failed to dismount.");
        }
    }
})

bot.once("kicked", console.log);
bot.once("error", console.log);