import { Button, Card } from 'antd';
import {
    BetaSchemaForm,
} from '@ant-design/pro-components';
import { deepClone } from '@/common/function';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default ({ data, delFields, setUpdateData }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: data.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        //transition,
        marginBottom: '12px',
        cursor: 'pointer'
    };

    return <>
        <Card
            title={`${data.valueTypeTitle} ${data.name}`}
            size="small"
            style={style}
            className={isDragging ? 'dragon' : ''}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            extra={<>
                <Button
                    size="small"
                    type="link"
                    onClick={() => {
                        setUpdateData(data);
                    }}
                >设置</Button>
                <Button
                    size="small"
                    type="link"
                    danger
                    onClick={() => {
                        delFields(data.id)
                    }}
                >删除</Button>
            </>}
        >
            <BetaSchemaForm
                shouldUpdate={true}
                columns={[deepClone(data)]}
                submitter={false}
            />
        </Card>
    </>

}
