/**
 * 当页面是ifram的时候
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const Iframe = ({ url, ...props }) => {
    return (
        <iframe
            key={url}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0"
            src={url}
        ></iframe>
    )
}

export default Iframe;