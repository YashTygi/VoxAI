import localFont from 'next/font/local'


const SkModernist = localFont({
    src: [
        {
            path: '../assets/font/Sk-Modernist-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../assets/font/Sk-Modernist-Bold.otf',
            weight: '600',
            style: 'normal',
        },
    ],
    variable: '--font-sk-modernist',
})

export default SkModernist