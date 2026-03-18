import { Card, Button, Typography } from 'antd';
import {
    EyeOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './item.css'

const Item = ({ data, preview, remove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: data.img });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            key={data.uid}
            size="small"
            styles={{
                root: style,
                body: { padding: 8 }
            }}
            ref={setNodeRef}
            hoverable={isDragging}
            classNames={{
                root: isDragging ? 'dragon imgTitle-img' : 'imgTitle-img'
            }}
            {...attributes}
            {...listeners}
        >
            <div className="bg" >
                <img src={data.img} />
                <div className="hover">
                    <div>
                        <Button type="text" size="small" onClick={() => preview(data)}>
                            <EyeOutlined className="icon" />
                        </Button>
                        <Button type="text" size="small" onClick={() => remove(data)}>
                            <DeleteOutlined className="icon" />
                        </Button>
                    </div>
                </div>
            </div>
            <div>{data.title}</div>
            <div><Typography.Text type="secondary" style={{ fontSize: 12 }}>{data.intro}</Typography.Text></div>
        </Card>
    )
}

export default Item;