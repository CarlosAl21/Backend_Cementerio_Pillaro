import { User } from "src/user/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Cementerio')
export class Cementerio {
    @PrimaryGeneratedColumn('uuid')
    id_cementerio: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    direccion: string;

    @Column({ type: 'varchar', length: 100 })
    telefono: string;

    @Column({ type: 'varchar', length: 100 })
    responsable: string;

    @Column({ type: 'varchar', length: 100 })
    estado: string;

    @Column({ type: 'varchar', length: 100 })
    fecha_creacion: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    fecha_modificacion: string;

    @OneToMany(() => User, (user) => user.id_cementerio_pert)
    usuarios: User[];

    @BeforeInsert()
    async FechaCreacion() {
        this.fecha_creacion = new Date().toISOString();
        this.estado = 'Activo';
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.fecha_modificacion = new Date().toISOString();
    }
    
}
