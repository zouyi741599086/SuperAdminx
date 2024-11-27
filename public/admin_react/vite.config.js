import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    return {
        plugins: [
            react(),
            //打包的时候，增加代码加密混淆
            command === 'build' ? obfuscatorPlugin({
                include: ["src/common/*.js"], //要加密的文件
                exclude: ["src/common/config.js"], //要排除的文件
                options: {
                    // 压缩代码
                    compact: true,
                    // 是否启用控制流扁平化(降低1.5倍的运行速度)
                    controlFlowFlattening: true,
                    // 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
                    controlFlowFlatteningThreshold: 1,
                    // 随机的死代码块(增加了混淆代码的大小)
                    deadCodeInjection: true,
                    // 死代码块的影响概率
                    deadCodeInjectionThreshold: 1,
                    // 此选项几乎不可能使用开发者工具的控制台选项卡
                    debugProtection: true,
                    // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
                    debugProtectionInterval: 1000,
                    // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
                    disableConsoleOutput: true,
                    // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
                    identifierNamesGenerator: 'hexadecimal',
                    log: false,
                    // 是否启用全局变量和函数名称的混淆
                    renameGlobals: false,
                    // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
                    rotateStringArray: true,
                    // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
                    selfDefending: true,
                    // 删除字符串文字并将它们放在一个特殊的数组中
                    stringArray: true,
                    stringArrayThreshold: 1,
                    // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
                    transformObjectKeys: true,
                    unicodeEscapeSequence: false
                },
            }) : [],
            //excludeFolderPlugin('src/pages/adminSetting/codeGenerator'),
        ],
        server: {
            port: '5204', // 指定启动端口
        },
        base: '/admin/',
        build: {
            outDir: '../admin', //打包输出目录
            emptyOutDir: true, //每次打包强制清空打包目录
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    }
})
