import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    return {
        plugins: [
            react(),
            //�����ʱ�����Ӵ�����ܻ���
            command === 'build' ? obfuscatorPlugin({
                include: ["src/common/*.js"], //Ҫ���ܵ��ļ�
                exclude: ["src/common/config.js"], //Ҫ�ų����ļ�
                options: {
                    // ѹ������
                    compact: true,
                    // �Ƿ����ÿ�������ƽ��(����1.5���������ٶ�)
                    controlFlowFlattening: true,
                    // Ӧ�ø���;�ڽϴ�Ĵ�����У����齵�ʹ�ֵ����Ϊ�����Ŀ�����ת�����ܻ����Ӵ���Ĵ�С�����ʹ�����ٶȡ�
                    controlFlowFlatteningThreshold: 1,
                    // ������������(�����˻�������Ĵ�С)
                    deadCodeInjection: true,
                    // ��������Ӱ�����
                    deadCodeInjectionThreshold: 1,
                    // ��ѡ���������ʹ�ÿ����߹��ߵĿ���̨ѡ�
                    debugProtection: true,
                    // ���ѡ�У�����ڡ�����̨��ѡ���ʹ�ü��ǿ�Ƶ���ģʽ���Ӷ�����ʹ�á�������Ա���ߡ����������ܡ�
                    debugProtectionInterval: 1000,
                    // ͨ���ÿպ����滻����������console.log��console.info��console.error��console.warn����ʹ�õ�������ʹ�ø������ѡ�
                    disableConsoleOutput: true,
                    // ��ʶ���Ļ�����ʽ hexadecimal(ʮ������) mangled(�̱�ʶ��)
                    identifierNamesGenerator: 'hexadecimal',
                    log: false,
                    // �Ƿ�����ȫ�ֱ����ͺ������ƵĻ���
                    renameGlobals: false,
                    // ͨ���̶���������ڴ������ʱ���ɣ���λ���ƶ����顣��ʹ�ý�ɾ�����ַ�����˳������ԭʼλ����ƥ���ø������ѡ����ԭʼԴ���벻С������ʹ�ô�ѡ���Ϊ����������������ע�⡣
                    rotateStringArray: true,
                    // ������Ĵ���,����ʹ�ô�������,ͬʱ��Ҫ���� cpmpat:true;
                    selfDefending: true,
                    // ɾ���ַ������ֲ������Ƿ���һ�������������
                    stringArray: true,
                    stringArrayThreshold: 1,
                    // ��������/�����ַ���ת��Ϊunicodeת�����С�Unicodeת�����д�������˴����С�����ҿ������ɵؽ��ַ����ָ�Ϊԭʼ��ͼ���������С��Դ�������ô�ѡ�
                    transformObjectKeys: true,
                    unicodeEscapeSequence: false
                },
            }) : [],
            //excludeFolderPlugin('src/pages/adminSetting/codeGenerator'),
        ],
        server: {
            port: '5200', // ָ�������˿�
        },
        base: '/admin/',
        build: {
            outDir: '../admin', //������Ŀ¼
            emptyOutDir: true, //ÿ�δ��ǿ����մ��Ŀ¼
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    }
})
