import React, {useEffect, useState} from 'react';
import {useAuth} from '../hooks/AuthContext';
import {fetchServers, getUserPermissions, updateUserPermission} from '../services/MSU-Backend-Service';
import {MinecraftServer, PermissionType, User} from '../constants/Types';
import {Table} from 'react-bootstrap';
import '../style/user-management.css';
import {Form} from 'react-bootstrap';
import {useToast} from '../hooks/ToastContext';

function UserManagementPage() {
    const [auth,, hasPermission] = useAuth();
    const [mcServers, setMcServers] = useState<MinecraftServer[]>([]);
    const [permissions, setPermissions] = useState<User[]>([]);
    const addToast = useToast();

    useEffect(() => {
        if(auth && hasPermission('General Permissions', 'U')) {
            fetchServers().then((res) => {
                setMcServers(res.data);
            });
            getUserPermissions(auth.id).then(res => {
                setPermissions(res.data);
            });
        }
    }, [auth]);

    function permissionChange(change){
        const user = change.target.id.split('-')[0];
        const permission: PermissionType = {
            server: change.target.id.split('-')[1],
            permission: change.target.id.split('-')[2]
        };
        const value = change.target.checked;

        updateUserPermission(auth.id, user, permission, value).catch(() => {
            addToast({
                title: 'Unable to update user permissions.',
                description: 'Reload the page as this information is no longer accurate.',
                type: 'danger'
            });
        });
    }
    
    function renderGeneralPermissionsTable(){
        const permissionKey = 'General Permissions';
        return <>
            <h1 key={permissionKey} className={'perm-heading'}>{permissionKey}</h1>
            <Table striped bordered variant='dark' className={'perm-table'} size={'sm'}>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Site Administrator</th>
                    <th>Create Server</th>
                    <th>User Administrator</th>
                </tr>
                </thead>
                <tbody>
                {permissions.map(user => {
                    return <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>
                            <Form.Check
                                type={'checkbox'}
                                id={`${user.id}-${permissionKey}-A`}
                                defaultChecked={user.permissions[permissionKey]?.includes('A')}
                                onChange={permissionChange}
                            />
                        </td>
                        <td>
                            <Form.Check
                                type={'checkbox'}
                                id={`${user.id}-${permissionKey}-C`}
                                defaultChecked={user.permissions[permissionKey]?.includes('C')}
                                onChange={permissionChange}
                            />
                        </td>
                        <td>
                            <Form.Check
                                type={'checkbox'}
                                id={`${user.id}-${permissionKey}-U`}
                                defaultChecked={user.permissions[permissionKey]?.includes('U')}
                                onChange={permissionChange}
                            />
                        </td>
                    </tr>;
                })}
                </tbody>
            </Table>
        </>;
    }

    function renderPermissionsTables(){
        const servers: string[] = mcServers.map(server => server.name);
        
        return <>
            {servers.map(permissionKey => {
                return <>
                    <h1 key={permissionKey} className={'perm-heading'}>{permissionKey}</h1>
                    <Table striped bordered variant='dark' className={'perm-table'} size={'sm'}>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Console</th>
                            <th>Properties</th>
                            <th>State</th>
                        </tr>
                        </thead>
                        <tbody>
                        {permissions.map(user => {
                            return <tr key={user.username}>
                                <td>{user.username}</td>
                                <td>
                                    <Form.Check
                                        type={'checkbox'}
                                        id={`${user.id}-${permissionKey}-c`}
                                        defaultChecked={user.permissions[permissionKey]?.includes('c')}
                                        onChange={permissionChange}
                                    />
                                </td>
                                <td>
                                    <Form.Check
                                        type={'checkbox'}
                                        id={`${user.id}-${permissionKey}-e`}
                                        defaultChecked={user.permissions[permissionKey]?.includes('e')}
                                        onChange={permissionChange}
                                    />
                                </td>
                                <td>
                                    <Form.Check
                                        type={'checkbox'}
                                        id={`${user.id}-${permissionKey}-s`}
                                        defaultChecked={user.permissions[permissionKey]?.includes('s')}
                                        onChange={permissionChange}
                                    />
                                </td>
                            </tr>;
                        })}
                        </tbody>
                    </Table>
                </>;
            })}
        </>;
    }

    return <>
        <h1 className={'perm-heading'}>Users</h1>
        <Table striped bordered variant='dark' className={'perm-table'} size={'sm'}>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
            {permissions.map(user => {
                return <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                </tr>;
            })}
            </tbody>
        </Table>
        {renderGeneralPermissionsTable()}
        {renderPermissionsTables()}
    </>;
}

export default UserManagementPage;